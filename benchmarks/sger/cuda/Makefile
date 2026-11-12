CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sger

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sger: sger.c $(HDRS) | $(BIN)
	$(CC) sger.c -o $(BIN)/sger -lcublas

clean:
	rm -rf $(BIN)
