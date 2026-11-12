CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dger

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dger: dger.c $(HDRS) | $(BIN)
	$(CC) dger.c -o $(BIN)/dger -lcublas

clean:
	rm -rf $(BIN)
