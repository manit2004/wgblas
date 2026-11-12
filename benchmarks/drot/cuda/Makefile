CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/drot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/drot: drot.c $(HDRS) | $(BIN)
	$(CC) drot.c -o $(BIN)/drot -lcublas

clean:
	rm -rf $(BIN)
